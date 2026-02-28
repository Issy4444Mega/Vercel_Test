import React from "react";
import dynamic from "next/dynamic";

const YMaps = dynamic(
  () => import("@pbe/react-yandex-maps").then(mod => mod.YMaps),
  { ssr: false }
);

const Map = dynamic(
  () => import("@pbe/react-yandex-maps").then(mod => mod.Map),
  { ssr: false }
);

const Placemark = dynamic(
  () => import("@pbe/react-yandex-maps").then(mod => mod.Placemark),
  { ssr: false }
);

export default function Shops() {
  const [shops, setShops] = React.useState([]);
  const [ymaps, setYmaps] = React.useState(null);

  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [lat, setLat] = React.useState("");
  const [lng, setLng] = React.useState("");

  React.useEffect(() => {
    fetch("/api/getShops")
      .then(res => res.json())
      .then(data => setShops(data));
  }, []);

  // Клик по карте
  const handleMapClick = async (e) => {
  const coords = e.get("coords");

  setLat(coords[0]);
  setLng(coords[1]);

  if (ymaps && ymaps.geocode) {
    try {
      const result = await ymaps.geocode(coords);
      const firstGeoObject = result.geoObjects.get(0);
      const foundAddress = firstGeoObject.getAddressLine();

      setAddress(foundAddress);
    } catch (err) {
      console.error("Ошибка геокодирования:", err);
      setAddress(""); 
    }
  } else {
    console.warn("maps ещё не загружен");
  }
};

  const addShop = async () => {
    if (!name || !address || !lat || !lng) {
      alert("Заполните все поля!");
      return;
    }

    const newShop = {
      name,
      address,
      coords: [Number(lat), Number(lng)]
    };

    await fetch("/api/addShop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newShop)
    });

    setShops(prev => [...prev, newShop]);

    setName("");
    setAddress("");
    setLat("");
    setLng("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Зоомагазины</h1>

      <YMaps
        query={{ lang: "ru_RU" }}
      >
        <Map
          defaultState={{ center: [53.1959, 45.0183], zoom: 12 }}
          width="100%"
          height="500px"
          onClick={handleMapClick}
          onLoad={(ymapsInstance) => setYmaps(ymapsInstance)}
        >
          {shops.map((shop, i) => (
            <Placemark
              key={i}
              geometry={shop.coords}
              properties={{
                balloonContent: `<strong>${shop.name}</strong><br/>${shop.address}`
              }}
              modules={["geoObject.addon.balloon"]}
            />
          ))}

          {lat && lng && (
            <Placemark geometry={[Number(lat), Number(lng)]} />
          )}
        </Map>
      </YMaps>

      <h2 style={{ marginTop: "30px" }}>Добавить магазин</h2>

      <input
        placeholder="Название"
        value={name}
        onChange={e => setName(e.target.value)}
      /><br />

      <input
        placeholder="Адрес"
        value={address}
        onChange={e => setAddress(e.target.value)}
      /><br />

      <input
        placeholder="Широта"
        value={lat}
        readOnly
      /><br />

      <input
        placeholder="Долгота"
        value={lng}
        readOnly
      /><br />

      <button style={{ marginTop: "10px" }} onClick={addShop}>
        Добавить
      </button>
    </div>
  );
}