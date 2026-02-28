import fs from 'fs';

export default function (req, res) {
  if (req.method === 'POST') {
    const file = fs.readFileSync('public/shops.json');
    const shops = JSON.parse(file);

    shops.push(req.body);

    fs.writeFileSync('public/shops.json', JSON.stringify(shops, null, 2));

    res.status(200).send("OK");
  } else {
    res.status(400).send("Only POST");
  }
}