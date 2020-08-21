import { createCanvas, loadImage, registerFont } from 'canvas';
// @ts-ignore
import template from './template.jpg';
// @ts-ignore
import fontArial from './Arial-BoldMT.woff';
import * as fs from 'fs';

registerFont(__dirname + '/' + fontArial, {
  family: 'Arial',
});
const width = 1653;
const height = 2339;

const canvas = createCanvas(width, height, 'pdf');
const context = canvas.getContext('2d');

export async function createImage(firstName, lastName, score) {
  const image = await loadImage(__dirname + '/' + template);
  context.drawImage(image, 0, 0, width, height);

  context.fillStyle = '#222'; //'#fc454a';
  context.font = '68pt Arial';
  context.textAlign = 'center';
  context.fillText(firstName, width / 2, 1090);
  context.fillText(lastName, width / 2, 1185);
  context.fillText(`${score} из 50`, width / 2, 1510);
  return canvas.toBuffer('application/pdf', {
    title: "Сертификат участника",
  });
}
