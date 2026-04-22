const Card = ({ title, value, icon }) => {
  return (
    <div className="p-5 rounded-xl bg-white/5 border border-white/10 
    shadow-lg hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(34,197,94,0.2)] 
    transition duration-300">

      <h3 className="text-gray-400 text-sm flex items-center gap-2">
        <span className="text-lg">{icon}</span> {title}
      </h3>

      <h1 className="text-2xl font-bold mt-2">{value}</h1>

    </div>
  );
};

export default Card;