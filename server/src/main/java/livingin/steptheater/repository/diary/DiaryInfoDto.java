package livingin.steptheater.repository.diary;

import livingin.steptheater.domain.DiaryItem;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DiaryInfoDto {
    private String DiaryDate;
    private String name;
    private Double latitude;
    private Double longitude;
    private String title;
    private String description;
    private Double i_latitude;
    private Double i_longitude;
    private String image_url;
    private String thumb_url;
}
