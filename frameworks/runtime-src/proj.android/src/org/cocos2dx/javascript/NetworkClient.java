import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;


class PostClass extends Thread {
    public String postMsg; 
    public static final String IP_ADD = "localhost";
    public static final int PORT = 6400;
    public String state = null;

    public void run() {
        Socket socket = null;
        try {
            socket = new Socket(IP_ADD, PORT);
        }
        catch (IOException e) {
            System.out.println("链接异常");
        }


        try {
            DataInputStream input = new DataInputStream(socket.getInputStream());
            DataOutputStream out = new DataOutputStream(socket.getOutputStream());
            System.out.println(postMsg);
            out.writeUTF(postMsg);

            String ret;
            ret = input.readUTF();
            if ("GET".equals(postMsg))
                state = ret;


            System.out.println(ret);
            out.close();
            input.close();
        }
        catch (IOException e) {
            System.out.println(e);
        }
    }
}


public class NetworkClient {


    public static String getState() {
        PostClass postClass = new PostClass();
        postClass.postMsg = "GET";
        postClass.run();
        return postClass.state;
    }

    public static void postState(String status) {
        PostClass postClass = new PostClass();
        postClass.postMsg = status;
        new Thread(postClass).start();
    }

    public static void main(String[] args) {
        postState("{123:123}");
    }
}
