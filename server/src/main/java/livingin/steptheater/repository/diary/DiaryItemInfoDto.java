package livingin.steptheater.repository.diary;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DiaryItemInfoDto {
    private Long id;
    private String title;
    private String description;
    private Double latitude;
    private Double longitude;
    private String image_url;
    private String thumb_url;
}
