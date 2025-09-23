// src/data/products.ts

export interface Product {
  img: string;
  title: string;
  price: string;
  status?: "sold" | "on hold" | "available"; // optional
}

export const products: Product[] = [
  {
    img: "http://longnd.myqnapcloud.com:8253/share.cgi/DSCF2829(edited).JPG?ssid=a542fdaca32644f9a27029e028a33d81&openfolder=normal&ep=&_dc=1757771851392&fid=a542fdaca32644f9a27029e028a33d81",
    title: "Cartier Solo 1011 Galaxy Dial Date 2000s Stainless Steel",
    price: "1000000",
    status: "available",
  },
  {
    img: "http://longnd.myqnapcloud.com:8253/share.cgi/DSCF2844(edited).JPG?ssid=a4c57bd64bb5498bbfef871276bb58ce&openfolder=normal&ep=&_dc=1757906042035&fid=a4c57bd64bb5498bbfef871276bb58ce",
    title: "Bulova Submariner Black Dial Date 1990s",
    price: "2000000",
    status: "available",
  },
  {
    img: "http://longnd.myqnapcloud.com:8253/share.cgi/DSCF2577(edited)-Copy(1).JPG?ssid=96a1fbb533374dcea8e2cfda6dd7c4e4&openfolder=normal&ep=&_dc=1757907465040&fid=96a1fbb533374dcea8e2cfda6dd7c4e4",
    title: "Cartier",
    price: "1000000",
    status: "sold",
  },
  {
    img: "https://drive.usercontent.google.com/download?id=1aHLgSSaro12aepH9nHFrINdn3ikPusm2&export=view&authuser=0",
    title: "Bulova",
    price: "2000000",
    status: "available",
  },
  {
    img: "http://longnd.myqnapcloud.com:8253/share.cgi/DSCF3286(edited).JPG?ssid=62ec0b8d35f7429e88b61a5af12bdb69&openfolder=normal&ep=&_dc=1758251771376&fid=62ec0b8d35f7429e88b61a5af12bdb69&filename=DSCF3286(edited).JPG",
    title: "Cartier",
    price: "1000000",
    status: "on hold"
  },
  {
    img: "http://longnd.myqnapcloud.com:8253/share.cgi/DSCF0303(edited)-Copy(1).JPG?ssid=990a577a7ce74c9eab8ebc43800f9fee&openfolder=normal&ep=&_dc=1757992608655&fid=990a577a7ce74c9eab8ebc43800f9fee&filename=DSCF0303(edited)-Copy(1).JPG",
    title: "Bulova",
    price: "2000000",
    status: "available",
  },
  {
    img: "http://longnd.myqnapcloud.com:8253/share.cgi/DSCF0489(edited).JPG?ssid=990a577a7ce74c9eab8ebc43800f9fee&openfolder=normal&ep=&_dc=1757992647436&fid=990a577a7ce74c9eab8ebc43800f9fee&filename=DSCF0489(edited).JPG",
    title: "Cartier",
    price: "1000000",
    status: "on hold",
  },
  {
    img: "http://longnd.myqnapcloud.com:8253/share.cgi/DSCF0904(edited).JPG?ssid=990a577a7ce74c9eab8ebc43800f9fee&openfolder=normal&ep=&_dc=1757992718437&fid=990a577a7ce74c9eab8ebc43800f9fee&filename=DSCF0904(edited).JPG",
    title: "Bulova",
    price: "2000000",
    status: "sold",
  },
  {
    img: "http://longnd.myqnapcloud.com:8253/share.cgi/DSCF1061.JPG?ssid=990a577a7ce74c9eab8ebc43800f9fee&openfolder=normal&ep=&_dc=1757992779259&fid=990a577a7ce74c9eab8ebc43800f9fee&filename=DSCF1061.JPG",
    title: "Bulova",
    price: "2000000",
    status: "sold",
  }

];
