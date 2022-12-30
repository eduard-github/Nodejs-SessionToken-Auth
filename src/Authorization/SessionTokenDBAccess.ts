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
  }

  public storeSessionToken(token: SessionToken): Promise<void> {
    const { tokenId, username, valid, expirationTime, rignts } = token
    return new Promise((resolve, reject) => {
      this.pool.query(
        'INSERT INTO session (tokenId, username, valid, expirationTime, rights) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
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
