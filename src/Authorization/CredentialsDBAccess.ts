import { Pool } from 'pg';
import { Credentials } from "../Shared/Model";

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "nodedb",
  password: "123456",
  port: 5432,
}

export class CredentialDBAccess {

  private pool: Pool

  constructor() {
      this.pool = new Pool(credentials)
      this.pool.connect()
      this.pool.query(
        `CREATE TABLE IF NOT EXISTS credentials ( 
           id SERIAL PRIMARY KEY, 
           username TEXT NOT NULL, 
           password TEXT NOT NULL, 
           rights numeric[]
        )`
      )
  }

  public async putCredential(credentials: Credentials): Promise<any> {
    const { username, password, rights } = credentials
    return new Promise((resolve, reject) => {
      this.pool.query(
        'INSERT INTO credentials (username, password, rights) VALUES ($1, $2, $3)', 
        [username, password, rights], 
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

  public async getCredential(username: string, password: string): Promise<Credentials | undefined> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        'SELECT * FROM credentials WHERE username = $1 and password = $2', 
        [username, password], 
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
