package com.javaweb.converter;

import java.util.List;
import java.util.Map;

import com.javaweb.model.request.BuildingSearchRequest;
import com.javaweb.utils.BuildingSearchRequestUtil;
import org.springframework.stereotype.Component;

import com.javaweb.builder.BuildingSearchBuilder;

@Component



public class BuildingSearchBuilderConverter
{
    public BuildingSearchBuilder toBuildingSearchBuilder(BuildingSearchRequest buildingSearchRequest, List<String> typeCode)
    {
        BuildingSearchBuilder buildingSearchBuilder = new BuildingSearchBuilder.Builder()
                .setName(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getName(), String.class))
                .setFloorArea(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getFloorArea(), Long.class))
                .setWard(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getWard(), String.class))
                .setStreet(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getStreet(), String.class))
                .setDistrict(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getDistrict(), String.class))
                .setNumberOfBasement(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getNumberOfBasement(), Long.class))
                .setTypeCode(typeCode)
                .setManagerName(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getManagerName(), String.class))
                .setManagerPhone(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getManagerPhone(), String.class))
                .setRentPriceTo(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getRentPriceTo(), Long.class))
                .setRentPriceFrom(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getRentPriceFrom(), Long.class))
                .setAreaFrom(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getAreaFrom(), Long.class))
                .setAreaTo(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getAreaTo(), Long.class))
                .setStaffId(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getStaffId(), Long.class))
                .setLevel(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getLevel(), Long.class))
                .setDirection(BuildingSearchRequestUtil.getObject(buildingSearchRequest.getDirection(), String.class))
                .build();


        return buildingSearchBuilder;
    }
}