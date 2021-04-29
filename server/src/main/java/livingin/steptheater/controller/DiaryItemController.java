package livingin.steptheater.controller;

import livingin.steptheater.service.DiaryItemService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
public class DiaryItemController {

    private final DiaryItemService diaryItemService;

    /**
     * DiaryItem 생성 API
     */
    @PostMapping("/api/diary/item")
    public void saveItem(
            @RequestBody @Valid CreateDiaryItemRequest request
    ) {
        System.out.println("request = " + request);
        diaryItemService.join(
                request.id,
                request.date,
                request.title,
                request.desc,
                request.thumb_url,
                request.image_url,
                request.latitude,
                request.longitude,
                request.route_name);
    }

    /**
     * DiaryItem 생성 Data class
     */
    @Data
    static class CreateDiaryItemRequest {
        private Long id;
        private String date;
        private String title;
        private String desc;
        private String thumb_url;
        private String image_url;
        private Double latitude;
        private Double longitude;
        private String route_name;
    }
}
