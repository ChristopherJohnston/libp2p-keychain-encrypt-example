
## Description

Eample of cms encrypt/decrypt using SHA256 keys nad libp2p CMS cryptography.

## Instructions

```
npm install
npm start
```

* Open localhost:3000 in 2 browsers (E.g. chrome, safari)

* In browser 1:
    * Enter a key name and passcode (or leave default). Note passcode must be 20 chars or more.
    * Click "Create/Export Key"
        * This uses libp2p/keychain's "createKey" and "exportKey" to create a SHA256 private key and store it in the browser's IndexedDB storage and export it as text to the "Private Key" textbox.
        * "Private Key" will be populated.
        * Copy-paste the keyname, passcode and private key to browser2
    * Enter some text in "plain message"
    * Click Encrypt
        * This uses libp2p/cms to encrypt the plain message using the key with the same name as in the "key name" box (ie BLAH)
        * "Encrypted message" will be populated. 
        * Copy-paste this to the "Encrypted Message" textd box in browser2

* In browser 2:
    * Click "Import Key"
        * This uses libp2p/keychain's "importKey" to import the key and store it in the browser's IndexedDB storage.
    * Click "Decrypt"
        * This uses libp2p/cms to decrypt the message using the private key
        * "Plain message" will be populated with the same message as in browser1

Adapted from https://codesandbox.io/s/libp2p-keychain-mvp-7y5lo