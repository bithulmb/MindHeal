import { Brain, Heart, Handshake } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Brain className="w-12 h-12 text-primary" />,
      title: "Expert Psychologists",
      description: "Connect with licensed, experienced psychologists who specialize in various areas of mental health.",
    },
    {
      icon: <Heart className="w-12 h-12 text-primary" />,
      title: "Personalized Care",
      description: "Receive tailored support and treatment plans that address your specific needs and concerns.",
    },
    {
      icon: <Handshake className="w-12 h-12 text-primary" />,
      title: "Secure Platform",
      description: "Experience peace of mind with our confidential and secure communication platform.",
    },
  ];

  return (
    <section id="features" className="py-8 bg-background dark:bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground text-center mb-12">
          Why Choose MindHeal?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-card dark:bg-card shadow-lg hover:shadow-xl transition-shadow animate-fade-up border border-border dark:border-border"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-foreground dark:text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground dark:text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;