package livingin.steptheater.controller;

import livingin.steptheater.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;

@RestController
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    /**
     * 이메일 인증 발송 API
     */
    @GetMapping("/api/email/send/certified")
    public void sendCertifiedMail(
            @RequestParam(value = "email") String email,
            @RequestParam(value = "nickname") String nickname,
            @RequestParam(value = "certified") String certified
    ) throws MessagingException {
        StringBuffer emailContent = new StringBuffer();
        emailContent.append("<!DOCTYPE html>");
        emailContent.append("<html>");
        emailContent.append("<head>");
        emailContent.append("</head>");
        emailContent.append("<body>");
        emailContent.append(
                "<table width='100%' border='0' cellspacing='0' style='width: 100% !important'>" +
                        "<tbody>" +
                        "<tr>" +
                        "<td align='center'>" +
                        "<table width='600' border='0' cellspacing='0' cellpadding='40' style='border: 1px solid #eaeaea; border-radius: 5px; margin: 40px 0' >" +
                        "<tbody>" +
                        "<tr>" +
                        "<td align='center'>" +
                        "<div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; text-align: left; width: 465px;'>" +
                        " <table width='100%' border='0' cellspacing='0' cellpadding='0' style='width: 100% !important' >" +
                        "<tbody>" +
                        "<tr>" +
                        "<td align= 'center'>" +
                        "<div>" +
                        "<img src='https://user-images.githubusercontent.com/51100935/92151188-aa035080-ee5b-11ea-8650-6ecb62f91443.png' width='200px'/>" +
                        "<h1 style= 'color: #000; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; font-size: 24px; font-weight: normal; margin: 30px 0; margin-top: 15px; padding: 0;'>" +
                        "<b>걸음 한 편 </b>" +
                        "<span>이메일 인증</span>" +
                        "</h1>" +
                        "</div>" +
                        "</td>" +
                        "</tr>" +
                        "</tbody>" +
                        "</table>" +
                        "<p style= 'color: #000; font-family: -apple-system, BlinkMacSystemFont, Segoe UI,Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; font-size: 14px; line-height: 24px;'>" +
                        "안녕하세요 <b>" +
                        nickname
                        + "</b>님!" +
                        "</p>" +
                        "<p style='color: #000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; font-size: 14px; line-height: 24px;'>" +
                        "걸음 한 편의 회원이 되신 것을 진심으로 환영합니다!" +
                        "</p>" +
                        "<p style='color: #000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; font-size: 14px; line-height: 24px;'>" +
                        "아래의 링크를 클릭하면 회원가입이 완료됩니다." +
                        "</p>" +
                        "<p style='color: #000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; font-size: 14px; line-height: 24px;'>" +
                        "<a href='http://203.241.228.108:8080/api/member/certified?email=" + email + "&certified=" + certified +
                        "'style='color: #067df7; text-decoration: none' target='_blank'>인증하기</a>" +
                        "</p>" +
                        "</div>" +
                        "</td>" +
                        "</tr>" +
                        "</tbody>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
                        "</tbody>" +
                        "</table>");
        emailContent.append("</body>");
        emailContent.append("</html>");
        emailService.sendMail(email, "[걸음 한 편 이메일 인증]", emailContent.toString());
    }

    @GetMapping("/api/email/send/findPW")
    public void sendFindPwMail(
            @RequestParam(value = "email") String email,
            @RequestParam(value = "nickname") String nickname,
            @RequestParam(value = "certified") String certified
    ) throws MessagingException{
        StringBuffer emailContent = new StringBuffer();
        emailContent.append("<!DOCTYPE html>");
        emailContent.append("<html>");
        emailContent.append("<head>");
        emailContent.append("</head>");
        emailContent.append("<body>");
        emailContent.append(
                "<table width='100%' border='0' cellspacing='0' style='width: 100% !important'>" +
                        "<tbody>" +
                        "<tr>" +
                        "<td align='center'>" +
                        "<table width='600' border='0' cellspacing='0' cellpadding='40' style='border: 1px solid #eaeaea; border-radius: 5px; margin: 40px 0' >" +
                        "<tbody>" +
                        "<tr>" +
                        "<td align='center'>" +
                        "<div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; text-align: left; width: 465px;'>" +
                        " <table width='100%' border='0' cellspacing='0' cellpadding='0' style='width: 100% !important' >" +
                        "<tbody>" +
                        "<tr>" +
                        "<td align= 'center'>" +
                        "<div>" +
                        "<img src='https://user-images.githubusercontent.com/51100935/92151188-aa035080-ee5b-11ea-8650-6ecb62f91443.png' width='200px'/>" +
                        "<h1 style= 'color: #000; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; font-size: 24px; font-weight: normal; margin: 30px 0; margin-top: 15px; padding: 0;'>" +
                        "<b>걸음 한 편 </b>" +
                        "<span>비밀번호 변경</san>" +
                        "</h1>" +
                        "</div>" +
                        "</td>" +
                        "</tr>" +
                        "</tbody>" +
                        "</table>" +
                        "<p style= 'color: #000; font-family: -apple-system, BlinkMacSystemFont, Segoe UI,Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; font-size: 14px; line-height: 24px;'>" +
                        "안녕하세요 <b>" +
                        nickname
                        + "</b>님!" +
                        "</p>" +
                        "<p style='color: #000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; font-size: 14px; line-height: 24px;'>" +
                        "아래의 링크를 클릭하면 비밀번호 변경 창으로 이동됩니다." +
                        "</p>" +
                        "<p style='color: #000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; font-size: 14px; line-height: 24px;'>" +
                        "<a href='http://203.241.228.108:8080/api/member/findPW?email=" + email + "&certified=" + certified +
                        "'style='color: #067df7; text-decoration: none' target='_blank'>변경하기</a>" +
                        "</p>" +
                        "</div>" +
                        "</td>" +
                        "</tr>" +
                        "</tbody>" +
                        "</table>" +
                        "</td>" +
                        "</tr>" +
                        "</tbody>" +
                        "</table>");
        emailContent.append("</body>");
        emailContent.append("</html>");
        emailService.sendMail(email, "[걸음 한 편 비밀번호 변경]", emailContent.toString());

    }

}
