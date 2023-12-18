import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.io.*;

public class App {
    public static void data_parser(String filename) {
        PrintWriter pw = null; 
        try (Scanner sc = new Scanner(new File(filename))) {
            pw = new PrintWriter(new FileOutputStream("updated_stock_data.txt"));
            while (sc.hasNextLine()) {
                String ln = sc.nextLine();
                String[] lnsplit = ln.split("\\t");

                if (lnsplit.length >= 5) {
                    String pn = lnsplit[0];
                    String product = lnsplit[1];
                    String typ = lnsplit[2];
                    String plane = "";
                    String price = "";
                    String quantity = "";

                    if (lnsplit.length >= 6) {
                        plane = lnsplit[3];

                        if (lnsplit[4].matches("[0-9.]+")) {
                            price = lnsplit[4];

                            if (lnsplit[5].matches("[A-Za-z]+")) {
                                quantity = lnsplit[5];
                            } else {
                                quantity = lnsplit[5] + " " + lnsplit[6];
                            }
                        } else {
                            quantity = lnsplit[4] + " " + lnsplit[5];
                        }

                        StringBuilder sbQuantity = new StringBuilder();

                        for (int i = 6; i < lnsplit.length; i++) {
                            sbQuantity.append(lnsplit[i]).append(" ");
                        }

                        quantity += sbQuantity.toString().trim();
                    } else {
                        quantity = lnsplit[lnsplit.length - 1];
                    }


                    if (price.isEmpty()) {
                        String input = quantity;
                    
                        Pattern pattern = Pattern.compile("(\\d+(?:\\.\\d+)? (?:EUR|USD)) (\\d+)");
                    
                        Matcher matcher = pattern.matcher(input);
                    
                        if (matcher.find()) {
                            String value1 = matcher.group(1);
                            String value2 = matcher.group(2);
                            price = value1;
                            quantity = value2;
                        }
                    }
                    

                    // Print the extracted values
                    System.out.println("\"P/N\" " + pn);
                    System.out.println("Product: " + product);
                    System.out.println("Type: " + typ);
                    System.out.println("Plane: " + plane);
                    System.out.println("Price: " + price);
                    System.out.println("Quantity: " + quantity);
                    System.out.println();

                    pw.println( "{"+ "\"part_number\": " +" \"" + pn+ "\",");
                    pw.println( "\"product_name\": " +  " \"" + product + "\"," );
                    pw.println( "\"product_type\": " + " \"" + typ + "\"," );
                    pw.println(  "\"plane\": " + " \"" + plane + "\"," );
                    pw.println(  "\"price\": " + " \"" + price + "\"," );
                    pw.println( "\"quantity\": " + " \"" + quantity + "\"," );
                    pw.println( "\"shelf_location\": " + " \""  + " " + "\"," );
                    pw.println("\"In_stock\": " + " \"" + " " + "\"," );
                    pw.println("\"date_of_inspection\": " + " \"" + " " + "\"}," );
                }
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } finally{
            pw.close();
        }
    }

    public static void main(String[] args) {
        data_parser("/Users/omarelmasaoudi/Desktop/java_dataparser/dataparser/src/file_reader.txt");
    }
}
