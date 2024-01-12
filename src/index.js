import Keychain from "./Keychain";

import "./styles.css";

const keychain = new Keychain();
await keychain.initialize()
registerEventListeners();

function registerEventListeners() {
  const $keyName = document.querySelector("input#kname");
  const $pKey = document.querySelector("input#pkey");
  const $passcode = document.querySelector("input#passcode");

  const $importBtn = document.querySelector("button#importKey");
  const $exportBtn = document.querySelector("button#exportKey");

  $importBtn.addEventListener("click", async () => {
    const res = await keychain.importKey($keyName.value, $pKey.value, $passcode.value);
    console.log(res);
  });

  $exportBtn.addEventListener("click", async () => {
    const res = await keychain.exportKey($keyName.value, $passcode.value);
    console.log(res);
    $pKey.value = res;
  });


  const $messageInput = document.querySelector("input#message");
  const $encryptedMessageInput = document.querySelector(
    "input#encrypted-message"
  );
  const $encryptBtn = document.querySelector("button#encrypt");
  const $decryptBtn = document.querySelector("button#decrypt");

  $encryptBtn.addEventListener("click", async () => {
    const encryptedMessage = await keychain.encryptMessage($keyName.value, $passcode.value, $messageInput.value);
    console.log(encryptedMessage);
    $messageInput.value = "";
    $encryptedMessageInput.value = encryptedMessage;
  });

  $decryptBtn.addEventListener("click", async () => {
    const decryptedMessage = await keychain.decryptMessage(
      $passcode.value,
      $encryptedMessageInput.value
    );
    console.log(decryptedMessage);
    $messageInput.value = decryptedMessage;
    $encryptedMessageInput.value = "";
  });
}
