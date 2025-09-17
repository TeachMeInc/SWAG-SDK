import { generate } from 'lean-qr';
import { makeAsyncComponent } from 'lean-qr/extras/react';
import { createElement } from 'preact';
import * as hooks from 'preact/hooks';

const QR = makeAsyncComponent({ createElement, ...hooks }, generate);

interface Props {
  value: string;
}

export function QRCode (props: Props) {
  return (
    <div className='swag-qrCode'>
      <QR 
        content={props.value}
      />
    </div>
  );
}
