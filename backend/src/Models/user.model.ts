class UserModel {
    id: string;
    name: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
    is_sent: string;
    is_admin: string;
    is_deleted: string;


    constructor(id: string, name: string, email: string, password: string, created_at: string, updated_at: string, is_sent: string, is_admin: string, is_deleted: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.is_sent = is_sent;
        this.is_admin = is_admin;
        this.is_deleted = is_deleted;
    }

    
}

export interface DecodedData{
    Id: string,
    Name:string,
    Email:string,
    Role: string,
    iat: number
    exp: number
  }
  

export default UserModel