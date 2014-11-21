public class Test {
    private String a;

    public final static int myInt = 0;

    public String name;
    
    public Test(String a) {
        this.a = a;
    }

    private Test() {}

    void setMessage(String msg) {}
    
    public int add(int a, String b) {
        return a;
    }
    
    protected void test(double a) {
        System.out.println("Hello");
    }

    public static abstract class InstanceClass {
        public abstract void instance();
    }

    public final class InnerClass {
        static final String data = "testdata";
    }
}
