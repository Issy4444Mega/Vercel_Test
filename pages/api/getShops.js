import fs from 'fs';

export default function (req, res) {
  try {
    const data = fs.readFileSync('public/shops.json');
    res.status(200).send(data);
  } catch {
    res.status(200).send("[]");
  }
}