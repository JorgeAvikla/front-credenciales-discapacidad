import { DatosUsuario } from "./user.interface";

export interface LoginResponse {
  status: number;
  error: boolean;
  messages: string;
  datos_usuario: DatosUsuario;
  token: string;
}


