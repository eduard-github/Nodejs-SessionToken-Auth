import { AccessRight } from "../Shared/Model"

export interface Account {
  username: string,
  password: string
}

export interface SessionToken {
  token_id: string,
  username: string,
  valid: boolean,
  expiration_time: Date,
  rights: AccessRight[]
}

export enum TokenState {
  VALID,
  INVALID,
  EXPIRED
}

export interface TokenRights {
  rights: AccessRight[],
  state: TokenState
}

export interface TokenGenerator {
  generateToken(account: Account): Promise<SessionToken | undefined>
}

export interface TokenValidator {
  validateToken(tokenId: string): Promise<TokenRights>
}


