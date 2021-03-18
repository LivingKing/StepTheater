package livingin.steptheater.repository.diary;

import lombok.AllArgsConstructor;
import lombok.Data;
<<<<<<< HEAD
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
=======

@Data
@AllArgsConstructor
public class RouteInfoDto {
    private String name;
    private RouteItemInfoDto routeItemInfoDto;
>>>>>>> feature/detail
}
