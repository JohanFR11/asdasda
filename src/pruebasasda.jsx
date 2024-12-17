const generatePDF = () => {
    const doc = new jsPDF(); // Crea un nuevo documento PDF
  
    doc.addImage(images, 'PNG', 20, 5, 40, 30);
    doc.addImage(meltec, 'PNG', 130, 5, 60, 20);
  
    // Fecha y descripción
    const formattedDate = getFormattedDate();
    doc.setFontSize(12);
    doc.text(`Bogotá D.C. ,   ${formattedDate}`, 20, 50);
    doc.text('Cotizacion N°  -----', 20, 60);
    doc.text('Señores: cliente', 20, 70);
    doc.text('Asunto:  asdasdasfasfa', 20, 80);
  
    // Título de la cotización
    doc.setFontSize(16);
    doc.text('COTIZACION MELTEC COMUNICACIONES S.A.', 45, 90);
  
    doc.setFontSize(12);
    doc.text(
      'Reciba un cordial saludo en nombre de MELTEC COMUNICACIONES S.A., compañía dedicada al suministro, integración y desarrollo de soluciones empresariales y movilidad digital en Colombia. A continuación, me permito enviarle nuestra cotización de acuerdo a sus requerimientos. Esperamos que esta propuesta cumpla con sus expectativas y estaremos atentos a sus comentarios.',
      20,
      100,
      { maxWidth: 180 }
    );
  
    // Generar la tabla de productos
    doc.text('OFERTA ECONOMICA', 90, 130);
    doc.autoTable({
      startY: 140,
      head: [
        ['N° Parte', 'Tipo Producto', 'Moneda', 'Precio Lista', 'Precio Final', 'Descuento', 'Categoria Producto', 'Descripción'],
      ],
      body: partDetails.map((partDetail) => [
        partDetail.partNumber || '----',
        '----', // Puedes agregar un valor si tienes datos del tipo de producto
        '----', // Lo mismo para la moneda
        `${partDetail.listPrice || 0}$`,
        `${partDetail.finalPrice || 0}$`,
        `${partDetail.descuento || 0}%`,
        '----', // Lo mismo para la categoría
        '----', // Lo mismo para la descripción
      ]),
      theme: 'grid', // El tema para la tabla
      headStyles: { fillColor: [148, 199, 255] }, // Color de fondo para la cabecera
      styles: { fontSize: 10 }, // Tamaño de la fuente
    });
  
    // Tiempo de entrega en formato solicitado
    const formattedDeliveryTime = formatDeliveryTime(deliveryTime); // Convierte a palabras y formato deseado
    doc.setFontSize(12);
    doc.text(formattedDeliveryTime, 20, doc.lastAutoTable.finalY + 10);
  
    // Descarga el PDF generado
    doc.save('cotizacion_meltec.pdf');
  };
  