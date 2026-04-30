import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';
import { sendOtp } from './mail.js';

const OTP_TTL_MINUTES = 10;
const JWT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user'],
        'x-hasura-default-role': 'user',
        'x-hasura-user-id': user.id,
      },
    },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: JWT_TTL_SECONDS }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
}

export async function requestLogin(email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    const e = new Error('invalid email'); e.statusCode = 400; throw e;
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);

  await query(
    `UPDATE login_otp SET consumed_at = now()
     WHERE email = $1 AND consumed_at IS NULL AND expires_at > now()`,
    [normalized]
  );
  await query(
    `INSERT INTO login_otp (email, otp_hash, expires_at) VALUES ($1, $2, $3)`,
    [normalized, otpHash, expiresAt]
  );

  await sendOtp(normalized, otp);
}

export async function verifyOtp(email, otp) {
  const normalized = String(email || '').trim().toLowerCase();
  const code = String(otp || '').trim();
  if (!/^\d{6}$/.test(code)) {
    const e = new Error('invalid otp format'); e.statusCode = 400; throw e;
  }

  const { rows } = await query(
    `SELECT ctid, otp_hash FROM login_otp
     WHERE email = $1 AND consumed_at IS NULL AND expires_at > now()
     ORDER BY created_at DESC LIMIT 1`,
    [normalized]
  );
  if (rows.length === 0) {
    const e = new Error('otp not found or expired'); e.statusCode = 401; throw e;
  }

  const ok = await bcrypt.compare(code, rows[0].otp_hash);
  if (!ok) {
    const e = new Error('otp mismatch'); e.statusCode = 401; throw e;
  }

  await query(`UPDATE login_otp SET consumed_at = now() WHERE ctid = $1`, [rows[0].ctid]);

  const upsert = await query(
    `INSERT INTO app_user (email, last_login_at) VALUES ($1, now())
     ON CONFLICT (email) DO UPDATE SET last_login_at = now()
     RETURNING id, email`,
    [normalized]
  );
  const user = upsert.rows[0];
  return { token: signToken(user), user };
}

export async function getMe(authHeader) {
  const m = /^Bearer\s+(.+)$/.exec(authHeader || '');
  if (!m) { const e = new Error('missing token'); e.statusCode = 401; throw e; }
  let claims;
  try { claims = verifyToken(m[1]); }
  catch { const e = new Error('invalid token'); e.statusCode = 401; throw e; }

  const { rows } = await query(`SELECT id, email FROM app_user WHERE id = $1`, [claims.sub]);
  if (rows.length === 0) { const e = new Error('user not found'); e.statusCode = 404; throw e; }
  return rows[0];
}
