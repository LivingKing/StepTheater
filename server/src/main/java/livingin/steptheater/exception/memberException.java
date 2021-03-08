package livingin.steptheater.exception;

public class memberException extends RuntimeException{
    public memberException() {
    }

    public memberException(String message) {
        super(message);
    }

    public memberException(String message, Throwable cause) {
        super(message, cause);
    }

    public memberException(Throwable cause) {
        super(cause);
    }

    public memberException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
