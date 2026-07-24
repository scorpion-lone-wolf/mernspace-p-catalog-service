import jwt from "jsonwebtoken";
export interface TokenPayload extends jwt.JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
  jti: string;
  iss: string;
  alg: string;
}
