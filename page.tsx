import { createClient } from "@supabase/supabase-js";
import { Mail, Phone, Instagram, Globe, MapPin, ArrowUpRight, Contact } from "lucide-react";

type Profile = {
  name: string; title: string; company: string; bio: string; phone: string;
  email: string; instagram: string; website: string; address: string;
  avatar_url: string; accent: string; show_phone: boolean; show_email: boolean;
  show_instagram: boolean; show_website: boolean; show_address: boolean;
};

const defaults: Profile = {
  name: "YOUR NAME", title: "YOUR POSITION", company: "YOUR COMPANY",
  bio: "당신을 소개하는 한 문장을 입력하세요.", phone: "", email: "",
  instagram: "", website: "", address: "", avatar_url: "", accent: "#c8a96e",
  show_phone: true, show_email: true, show_instagram: true,
  show_website: true, show_address: false
};

async function getProfile(): Promise<Profile> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return defaults;
  const db = createClient(url, key);
  const { data } = await db.from("profiles").select("*").eq("id", "owner").maybeSingle();
  return data ? { ...defaults, ...data } : defaults;
}

export default async function Home() {
  const p = await getProfile();
  const links = [
    p.show_phone && p.phone ? { icon: Phone, label: p.phone, href: `tel:${p.phone}` } : null,
    p.show_email && p.email ? { icon: Mail, label: p.email, href: `mailto:${p.email}` } : null,
    p.show_instagram && p.instagram ? { icon: Instagram, label: p.instagram.replace(/^@/, ""), href: `https://instagram.com/${p.instagram.replace(/^@/, "")}` } : null,
    p.show_website && p.website ? { icon: Globe, label: p.website.replace(/^https?:\/\//, ""), href: p.website.startsWith("http") ? p.website : `https://${p.website}` } : null,
    p.show_address && p.address ? { icon: MapPin, label: p.address, href: `https://maps.google.com/?q=${encodeURIComponent(p.address)}` } : null
  ].filter(Boolean) as {icon: any; label: string; href: string}[];

  const vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${p.name}\r\nORG:${p.company}\r\nTITLE:${p.title}\r\nTEL:${p.phone}\r\nEMAIL:${p.email}\r\nURL:${p.website}\r\nEND:VCARD`;
  return <main className="page">
    <div className="topline"><span>PERSONAL IDENTITY</span><span className="live"><i/> DIGITAL CARD</span></div>
    <section className="card">
      <div className="ornament ornament-one"/><div className="ornament ornament-two"/>
      <div className="monogram">{p.avatar_url ? <img src={p.avatar_url} alt="프로필"/> : <span>{(p.name || "Y").trim().charAt(0).toUpperCase()}</span>}</div>
      <div className="eyebrow">{p.company || "PERSONAL BRAND"}</div>
      <h1>{p.name}</h1>
      <div className="role">{p.title}</div>
      <div className="gold-rule"><span/></div>
      <p className="bio">{p.bio}</p>
      <div className="contact-list">
        {links.map(({icon: Icon, label, href}, i) => <a key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          <span className="contact-icon"><Icon size={17}/></span><span>{label}</span><ArrowUpRight className="arrow" size={15}/>
        </a>)}
      </div>
      <a className="save" href={`data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`} download={`${(p.name || "contact").replace(/\s+/g,"-")}.vcf`}>
        <Contact size={17}/> 연락처 저장
      </a>
      <div className="card-footer"><span>EST. PERSONAL CONNECTION</span><span>01 / IDENTITY</span></div>
    </section>
    <footer>DESIGNED TO CONNECT <span>✦</span> DIGITAL BUSINESS CARD</footer>
  </main>;
}