import { Pool } from 'pg';
import { SessionToken } from '../Server/Model';

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "nodedb",
  password: "123456",
  port: 5432,
}

export class SessionTokenDBAccess {

  private pool: Pool

  constructor() {
      this.pool = new Pool(credentials)
      this.pool.connect()
      this.pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      this.pool.query(
        `CREATE TABLE IF NOT EXISTS tokens ( 
          pid SERIAL PRIMARY KEY, 
          id UUID NOT NULL DEFAULT uuid_generate_v4(), 
          rights integer[] NOT NULL, 
          expirationTime DATE NOT NULL, 
          username TEXT NOT NULL, 
          valid BOOLEAN NOT NULL , 
          tokenId TEXT NOT NULL
        )`
      )
  }

  public storeSessionToken(token: SessionToken): Promise<void> {
    const { tokenId, username, valid, expirationTime, rignts } = token
    return new Promise((resolve, reject) => {
      this.pool.query(
        'INSERT INTO tokens (tokenId, username, valid, expirationTime, rights) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
        [tokenId, username, valid, expirationTime, rignts], 
        (err: Error, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result.rows[0])
          }
        }
      )
    })
  }

  // public async getUserCredential(username: string, password: string): Promise<UserCredentials | undefined> {
  //   return new Promise((resolve, reject) => {
  //     this.pool.query(
  //       'SELECT * FROM users WHERE username = $1 and password = $2', 
  //       [username, password], 
  //       (err: Error, result) => {
  //         if (err) {
  //           console.log('ERROR ----- ', err)
  //           reject(err)
  //         } else {
  //           if (!result.rows.length) {
  //             resolve(undefined)
  //           } else {
  //             resolve(result.rows[0])
  //           }
  //         }
  //       }
  //     )
  //   })
  // }
}
