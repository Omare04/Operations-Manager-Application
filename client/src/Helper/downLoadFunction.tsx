

export function downloadPdf(title, data) {

  //Since we are downloading based on a onClickfunction the window object allows us to dowload whatever from the entire window.
  //In this case its going to be a blob of the pdf data we pass through
  const url = window.URL.createObjectURL(new Blob([data]));
  //We create a new a tag call link which represents a link in the DOM, we will subsequently use use this
  //to trigger a download 
  const link = document.createElement("a");
  //sets the aboves link to the blob URL we created 
  link.href = url;
  //Setting the type to download and name
  link.setAttribute("download", `${title}.pdf`);

  //inserting the link element into the HTML document 
  //so that the user can access it and trigger the PDF download when clicked.
  document.body.appendChild(link);
  link.click();
}
