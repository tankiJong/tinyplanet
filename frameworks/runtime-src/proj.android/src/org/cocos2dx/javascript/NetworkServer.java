package org.cocos2dx.javascript;


import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
import java.lang.Runnable;

class SlaveServer extends Thread {

    public static int PORT = 6400;
    public static String _clientInput = "0";
    public static String _serverState = "Test";
    
    public void run() {
        try {
            ServerSocket serverSocket = new ServerSocket(PORT);

            while (true) {
                Socket socket = serverSocket.accept();
                DataInputStream input = new DataInputStream(socket.getInputStream());
                String clientInput = input.readUTF();

                if (clientInput.equals("GET")) {
                    DataOutputStream out = new DataOutputStream(socket.getOutputStream());
                    out.writeUTF(_serverState);
                    out.close();
                }
                else {
                    _clientInput = clientInput;
                    DataOutputStream out = new DataOutputStream(socket.getOutputStream());
                    out.writeUTF("OK");
                    out.close();
                }
                input.close();
            }
        } catch (Exception e) {
            System.out.println("服务器异常: " + e.getMessage());
        }
    }
}


public class NetworkServer {


    public static String getClientInput() {
        return SlaveServer._clientInput;
    }

    public static void setServerState(String state) {
        SlaveServer._serverState = state;
    }


    public static void main() throws Exception {
        
        new Thread(new SlaveServer()).start();
    }
}

