package com.javaweb.api.admin;


import com.javaweb.model.dto.AssignmentBuildingDTO;
import com.javaweb.model.dto.BuildingDTO;
import com.javaweb.model.request.BuildingSearchRequest;
import com.javaweb.model.response.BuildingSearchResponse;
import com.javaweb.model.response.ResponseDTO;
import com.javaweb.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController(value = "buildingAPIOfAdmin")
@RequestMapping("/api/building")
@Transactional

public class BuildingAPI
{
    @Autowired
    private BuildingService buildingService;

    @GetMapping
    public List<BuildingSearchResponse> getBuilding (@ModelAttribute BuildingSearchRequest buildingSearchRequest, Pageable pageable)
    {
        List<BuildingSearchResponse> res = buildingService.findAll(buildingSearchRequest, pageable);
        return res;
    }

    @PostMapping
    public ResponseEntity<BuildingDTO> addOrUpdateBuilding(@RequestBody BuildingDTO buildingDTO)
    {
        return ResponseEntity.ok(buildingService.addOrUpdateBuilding(buildingDTO));
    }

    @DeleteMapping("/{ids}")
    public ResponseEntity<BuildingDTO> deleteBuilding(@PathVariable Long[] ids)
    {
        return ResponseEntity.ok(buildingService.deleteBuildings(ids));
    }

    @GetMapping("/{id}/staffs")
    public ResponseDTO loadStaffs(@PathVariable Long id)
    {
        ResponseDTO result = buildingService.listStaffs(id);
        return result;
    }


    @PostMapping("/assigment")
    public ResponseEntity<AssignmentBuildingDTO> updateAssigmentBuilding(@RequestBody AssignmentBuildingDTO assignmentBuildingDTO)
    {
        return ResponseEntity.ok(buildingService.addAssignmentBuildingEntity(assignmentBuildingDTO));
    }
}
