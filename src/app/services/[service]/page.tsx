import React from "react";

interface ServicePageProps {
  params: Promise<{ service: string }>;
}

const ServicePage = async ({ params }: ServicePageProps) => {
  const { service } = await params;
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Service: {service.charAt(0).toUpperCase() + service.slice(1)}</h1>
      <p>This is the page for the <strong>{service}</strong> service.</p>
    </main>
  );
};

export default ServicePage;