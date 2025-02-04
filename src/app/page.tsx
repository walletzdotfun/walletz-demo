"use client"

import { WalletzButton, WalletzModal, useWalletz } from 'walletz';

export default function Home() {
  const { signMessage } = useWalletz();

  const handleSign = async () => {
    try {
      const sig = await signMessage('Hello, Solana!');
      console.log('Signature:', sig);
    } catch (error) {
      console.error('Signing failed:', error);
    }
  };

  return (
    <div>
      <h1>Test Walletz</h1>
      <WalletzButton />
      <WalletzModal />
      <button onClick={handleSign}>Sign Message</button>
    </div>
  );
}
