import { Pool } from 'pg';
import { User } from '../Shared/Model';

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "nodedb",
  password: "123456",
  port: 5432,
}

export class UserDBAccess {

  private pool: Pool

  constructor() {
      this.pool = new Pool(credentials)
      this.pool.connect()
      this.pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      this.pool.query(
        `CREATE TABLE IF NOT EXISTS users ( 
          pid SERIAL PRIMARY KEY, 
          id UUID NOT NULL DEFAULT uuid_generate_v4(), 
          name TEXT NOT NULL, 
          age NUMERIC NOT NULL,
          email TEXT NOT NULL, 
          position TEXT NOT NULL
        )`
      )
  }

  public async putUser(user: User): Promise<void> {
    const { name, age, email, position } = user
    return new Promise((resolve, reject) => {
      this.pool.query(
        'INSERT INTO users (name, age, email, position) VALUES ($1, $2, $3, $4)',
        [name, age, email, position],
        (err: Error) => {
          if (err) {
            reject(err) 
          } else {
            resolve() 
          }
        })
    })
  }

  public async getUserById(userId: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        'SELECT * FROM users WHERE id = $1',
        [userId],
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
        })
    })
  }

  public async getUserByName(name: string): Promise<User[]> {
    // const regExp = new RegExp(name)
    return new Promise((resolve, reject) => {
      this.pool.query(
        'SELECT * FROM users WHERE name = $1',
        [name],
        (err: Error, result) => {
          if (err) {
            reject(err) 
          } else {
            resolve(result.rows) 
          }
        })
    })
  }

  public async deleteUser(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [userId],
        (err: Error, result) => {
          if (err) {
            reject(err) 
          } else {
            if (!result.rows.length) {
              resolve(false) 
            } else {
              resolve(true) 
            }
          }
        })
    })
  }

}
