package com.javaweb.repository.custom;

import com.javaweb.builder.BuildingSearchBuilder;
import com.javaweb.entity.BuildingEntity;
import com.javaweb.model.response.BuildingSearchResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BuildingRepositoryCustom
{
    public List<BuildingEntity> findAll (BuildingSearchBuilder buildingSearchBuilder, Pageable pageable);
    int countTotalItem(BuildingSearchResponse buildingSearchResponse);
}