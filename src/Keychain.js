import { keychain } from "@libp2p/keychain";
import { defaultLogger } from '@libp2p/logger'
import { CMS } from '@libp2p/cms'
import { IDBDatastore } from 'datastore-idb'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

const DB_NAME = "spliit";

export default class Keychain {
  async initialize() {
    const dataStore = new IDBDatastore(DB_NAME);
    await dataStore.open()

    const components = {
      datastore: dataStore,
      logger: defaultLogger()
    }
    this.components = components
  }

  getKeychain(passcode) {
    return keychain({pass:passcode})(this.components);
  }

  async importKey(keyName, pKey, passcode) {
    await this.getKeychain(passcode)
      .importKey(keyName, atob(pKey), passcode)
      .catch(async err => {
        console.warn("unable to import keychain", err)
      })
  }

  async exportKey(keyName, passcode) {
    const kc = this.getKeychain(passcode);

    const key = await kc
    .findKeyByName(keyName)
    .catch(async err => {
      console.warn("no keychain found, create one");
    });

    if (!key) {
      await kc.createKey(keyName, "rsa", 2048).catch(err => {
        console.error("createKey error", err);
        throw err;
      });
    }

    const pkey = await kc.exportKey(keyName, passcode);
    const bencoded = btoa(pkey)
    return bencoded
  }

  async encryptMessage(keyName, passcode, message) {
    const cms = new CMS(this.getKeychain(passcode));

    const encryptedMessage = await cms
      .encrypt(keyName, uint8ArrayFromString(message, "ascii"))
      .catch(err => {
        console.error("encrypt error", err);
        throw err;
      });

    return btoa(JSON.stringify(Array.from(encryptedMessage)))
  }

  async decryptMessage(passcode, encryptedMessage) {
    const cms = new CMS(this.getKeychain(passcode));
    
    const encryptedArray = new Uint8Array(JSON.parse(atob(encryptedMessage)))

    console.log("er")
    console.log(encryptedArray)

    const decryptedMessage = await cms
      .decrypt(encryptedArray)
      .catch(err => {
        console.error("decrypt error", err);
        throw err;
      });

    return uint8ArrayToString(decryptedMessage, "ascii");
  }
}
