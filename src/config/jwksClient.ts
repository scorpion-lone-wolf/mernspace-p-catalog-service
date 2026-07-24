import config from "config";
import jwksClient from "jwks-rsa";

export const jwkClient = jwksClient({
  jwksUri: config.get("auth.jwks_uri"),
});
