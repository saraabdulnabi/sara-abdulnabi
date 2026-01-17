import Card from "./Card.jsx";

function CardList() {
  const cards = [
    { title: "HTML", description: "The structure of web pages" },
    { title: "CSS", description: "Styles your website" },
    { title: "JavaScript", description: "Adds interactivity" },
    { title: "React", description: "Builds UI with components" },
  ];

  return (
    <div className="card-list">
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          description={card.description}
        />
      ))}
    </div>
  );
}

export default CardList;
