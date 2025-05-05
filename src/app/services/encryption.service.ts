import * as CryptoJS from 'crypto-js';

// Genera una clave de la longitud adecuada
function generateKey(secretKey: string): CryptoJS.lib.WordArray {
  return CryptoJS.SHA256(secretKey);
}

export async function encryptData(data: string): Promise<string> {
  try {
    // Clave secreta - IMPORTANTE: Genera una clave única para tu aplicación
    const SECRET_KEY = 'y_CAK90lDLo6QuNR8gr22vfx73qyWMM-RlzSPfz3h5zx1sBHWIEs_HxXThEQEh_PK5mnPgx_ZhzGaJSFW4yhSQ';
    
    // Genera una clave derivada
    const key = generateKey(SECRET_KEY);
    
    // Convierte el dato a encriptar en una WordArray
    const dataWordArray = CryptoJS.enc.Utf8.parse(data);
    // Encripta usando AES
    const encrypted = CryptoJS.AES.encrypt(dataWordArray, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    // Devuelve como string
    return encrypted.toString();
  } catch (error) {
    console.error('Error encriptando datos', error);
    throw error;
  }
}

export async function decryptData(encryptedData: string): Promise<string> {
  try {
    // Usa la misma clave generada
    const SECRET_KEY = 'y_CAK90lDLo6QuNR8gr22vfx73qyWMM-RlzSPfz3h5zx1sBHWIEs_HxXThEQEh_PK5mnPgx_ZhzGaJSFW4yhSQ';
    const key = generateKey(SECRET_KEY);
    
    // Desencripta
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Convierte a string
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error desencriptando datos', error);
    throw error;
  }
}