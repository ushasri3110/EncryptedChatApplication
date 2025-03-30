package com.chat.utils;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

public class KeyUtil {

    private static final String AES_SECRET_KEY = "12345678901234567890123456789012";

    // Generate RSA Key Pair
    public static KeyPair generateRSAKeyPair() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        return generator.generateKeyPair();
    }

    // Encrypt private key using AES
    public static String encryptPrivateKey(PrivateKey privateKey) throws Exception {
        byte[] privateKeyBytes = privateKey.getEncoded();
        Cipher cipher = Cipher.getInstance("AES");
        SecretKey secretKey = getSecretKey();
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] encryptedBytes = cipher.doFinal(privateKeyBytes);
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    // Decrypt private key from encrypted Base64 string
    public static PrivateKey decryptPrivateKey(String encryptedPrivateKeyBase64) throws Exception {
        byte[] encryptedBytes = Base64.getDecoder().decode(encryptedPrivateKeyBase64);
        Cipher cipher = Cipher.getInstance("AES");
        SecretKey secretKey = getSecretKey();
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);

        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePrivate(new PKCS8EncodedKeySpec(decryptedBytes));
    }

    // Encode Public Key to Base64 String
    public static String encodePublicKey(PublicKey publicKey) {
        return Base64.getEncoder().encodeToString(publicKey.getEncoded());
    }

    // Get AES SecretKey object from string
    private static SecretKey getSecretKey() {
        return new SecretKeySpec(AES_SECRET_KEY.getBytes(), "AES");
    }

    public static String encryptMessage(String message, PublicKey publicKey) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        byte[] encryptedBytes = cipher.doFinal(message.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    // Decrypt message with RSA Private Key
    public static String decryptMessage(String encryptedMessageBase64, PrivateKey privateKey) throws Exception {
        byte[] encryptedBytes = Base64.getDecoder().decode(encryptedMessageBase64);
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
        return new String(decryptedBytes);
    }

}
