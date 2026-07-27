import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = async({
    data,
    columns,
    fileName = "Report.pdf",
    title="Reports",
    subtitle="",
    metadata=[],
    orientation="landscape",
    logo="/inventory_logo.png"
})=>{
    const doc = new jsPDF({
        orientation,
        unit: "mm",
        format: "a4"
    });

    if(logo){
        try{
            const logoRes = await fetch(logo);
            const blob = await logoRes.blob();
            const reader = new FileReader();
            await new Promise(resolve => {
                reader.onloadend = resolve;
                reader.readAsDataURL(blob);
            });
            doc.addImage(reader.result, 'PNG', 5, 5, 20, 20);

        }
        catch(e){
            console.error("error: ",e);
        }
    }


    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(title, 35, 15);

    let currentY=38;
    if(subtitle){
        doc.setFont("helvetica","normal");
        doc.setFontSize(12);
        doc.text(subtitle,35,currentY);
        currentY+=5;
    }

    if(metadata){
        doc.setFontSize(10);
        doc.setFont("helvetica","normal");
        metadata.forEach(({label,value})=>{
            doc.text(`${label}: ${value}`,10,currentY);
            currentY+=5;
        })
    }

    const headers = columns.map(column => column.title);
    const rows =data.map(row =>
        columns.map(column => {
            if(typeof column.accessor === "function"){
                return column.accessor(row);
            }
            return row[column.accessor];
        })
    );

    autoTable(doc,{
        startY:currentY,
        head:[headers],
        body:rows,
        theme:"grid",
        styles:{
            fontSize:9,
            cellPadding:3,
            overflow:"linebreak",
            valign:"middle",
            lineWidth:0.1,
            lineColor:[215,215,215]
        },
        headStyles:{
            fillColor:[41,128,185],
            textColor:255,
            fontStyle:"bold",
            fontSize:10,
            halign:"center",
            valign:"middle"
        },
        columnStyles: {
        4: { halign: "right" },
        5: { halign: "right" }
    }
    });
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 5, doc.internal.pageSize.height - 5);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 5, doc.internal.pageSize.height - 5, { align: "right" });
    }

    doc.save(fileName);
}
