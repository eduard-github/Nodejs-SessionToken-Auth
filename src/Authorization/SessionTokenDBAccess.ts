import { Pool } from 'pg';
import { SessionToken } from '../Server/Model';

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "nodesessiontokendb",
  password: "123456",
  port: 5432,
}

export class SessionTokenDBAccess {

  private pool: Pool

  constructor() {
    this.pool = new Pool(credentials)
    this.pool.connect()
    this.pool.query(
      `CREATE TABLE IF NOT EXISTS tokens ( 
          id SERIAL PRIMARY KEY, 
          rights numeric[] NOT NULL, 
          expiration_time TIMESTAMP WITH TIME ZONE NOT NULL, 
          username TEXT NOT NULL, 
          valid BOOLEAN NOT NULL, 
          token_id TEXT NOT NULL
        )`
    )
  }

  public async storeSessionToken(token: SessionToken): Promise<void> {
    const { token_id, username, valid, expiration_time, rights } = token
    return new Promise((resolve, reject) => {
      this.pool.query(
        'INSERT INTO tokens (token_id, username, valid, expiration_time, rights) VALUES ($1, $2, $3, $4, $5)',
        [token_id, username, valid, expiration_time, rights],
        (err: Error) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }

  public async getSessionToken(tokenId: string): Promise<SessionToken | undefined> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        'SElECT * FROM tokens WHERE token_id = $1',
        [tokenId],
        (err: Error, result) => {
          if (err) {
            reject(err)
          } else {
            if (!result.rows.length) {
              resolve(undefined)
            } else {
              resolve(result.rows[0])
            }
          }
        }
      )
    })
  }
}
