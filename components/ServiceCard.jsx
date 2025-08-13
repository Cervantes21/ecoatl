// components/ServiceCard.jsx
export default function ServiceCard({ title, description, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
      <div className="text-5xl text-fuchsia-600 mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold mb-2 text-blue-700">{title}</h3>
      <p className="text-base text-sky-800">{description}</p>
    </div>
  );
}
