package livingin.steptheater.repository.diary;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
@Data
public class RouteInfoDto {
    private Long id;
    private String name;
    private List<RouteItemInfoDto> routeItems;
    private List<DiaryItemInfoDto> diaryItems;

    public RouteInfoDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
