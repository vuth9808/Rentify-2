package com.javaweb.service;

import com.javaweb.model.dto.AssignmentBuildingDTO;
import com.javaweb.model.dto.BuildingDTO;
import com.javaweb.model.request.BuildingSearchRequest;
import com.javaweb.model.response.BuildingSearchResponse;
import com.javaweb.model.response.ResponseDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BuildingService
{
    List<BuildingSearchResponse> findAll (BuildingSearchRequest buildingSearchRequest, Pageable pageable);
    BuildingDTO deleteBuildings(Long[] ids);
    BuildingDTO addOrUpdateBuilding(BuildingDTO buildingDTO);
    BuildingDTO findById(Long id);
    ResponseDTO listStaffs(Long buildingId);
    int countTotalItem(List<BuildingSearchResponse> list);
    AssignmentBuildingDTO addAssignmentBuildingEntity(AssignmentBuildingDTO assignmentBuildingDTO);
}