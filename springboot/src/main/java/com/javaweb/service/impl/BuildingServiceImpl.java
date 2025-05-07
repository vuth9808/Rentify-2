package com.javaweb.service.impl;

import com.javaweb.builder.BuildingSearchBuilder;
import com.javaweb.converter.BuildingConverter;
import com.javaweb.converter.BuildingSearchBuilderConverter;
import com.javaweb.converter.RentAreaConverter;
import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.RentAreaEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.exception.NotFoundException;
import com.javaweb.model.dto.AssignmentBuildingDTO;
import com.javaweb.model.dto.BuildingDTO;
import com.javaweb.model.request.BuildingSearchRequest;
import com.javaweb.model.response.BuildingSearchResponse;
import com.javaweb.model.response.ResponseDTO;
import com.javaweb.model.response.StaffResponseDTO;
import com.javaweb.repository.BuildingRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.BuildingService;
import com.javaweb.utils.NumberUtils;
import com.javaweb.utils.StringUtils;
import com.javaweb.utils.UploadFileUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BuildingServiceImpl implements BuildingService
{

    @Autowired
    private BuildingSearchBuilderConverter buildingSearchBuilderConverter;

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private BuildingConverter buildingconverter;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UploadFileUtils uploadFileUtils;

    public List<BuildingSearchResponse> findAll(BuildingSearchRequest buildingSearchRequest, Pageable pageable)
    {
        List<String> typeCode = buildingSearchRequest.getTypeCode();
        BuildingSearchBuilder buildingSearchBuilder = buildingSearchBuilderConverter.toBuildingSearchBuilder(buildingSearchRequest, typeCode);

        List<BuildingEntity> buildingEntities = buildingRepository.findAll(buildingSearchBuilder, pageable);
        List<BuildingSearchResponse> res = new ArrayList<>();


        for(BuildingEntity item : buildingEntities)
        {
            BuildingSearchResponse building = buildingconverter.toBuildingSearchResponse(item);
            res.add(building);
        }

        return res;
    }

    @Override
    public BuildingDTO deleteBuildings(Long[] ids)
    {
        BuildingEntity buildingEntity = buildingRepository.findById(ids[0]).get();
        buildingRepository.deleteByIdIn(ids);
        return buildingconverter.tobuildingDTO(buildingEntity);
    }

    @Override
    public BuildingDTO addOrUpdateBuilding(BuildingDTO buildingDTO)
    {
        if(!checkAddBuilding(buildingDTO)) return null;
        BuildingEntity buildingEntity = buildingconverter.toBuildingEntity(buildingDTO);

        // update
        Long buildingId = buildingDTO.getId();
        if (buildingId != null)
        {
            BuildingEntity foundBuilding = buildingRepository.findById(buildingId)
                    .orElseThrow(() -> new NotFoundException("Building not found!"));
            buildingEntity.setUserEntities(foundBuilding.getUserEntities());
            buildingEntity.setImage(foundBuilding.getImage());
        }
        saveThumbnail(buildingDTO, buildingEntity);
        buildingRepository.save(buildingEntity);
        return buildingDTO;
    }

    private void saveThumbnail(BuildingDTO buildingDTO, BuildingEntity buildingEntity)
    {
        String path = "/building/" + buildingDTO.getImageName();
        if (null != buildingDTO.getImageBase64())
        {
            if (null != buildingEntity.getImage())
            {
                if (!path.equals(buildingEntity.getImage()))
                {
                    File file = new File("C://home/office" + buildingEntity.getImage());
                    file.delete();
                }
            }
            byte[] bytes = Base64.decodeBase64(buildingDTO.getImageBase64().getBytes());
            uploadFileUtils.writeOrUpdate(path, bytes);
            buildingEntity.setImage(path);
        }
    }



    public static boolean checkAddBuilding(BuildingDTO buildingDTO)
    {
        if(!StringUtils.check(buildingDTO.getName())) return false;
        if(!StringUtils.check(buildingDTO.getDistrict())) return false;
        if(!StringUtils.check(buildingDTO.getWard())) return false;
        if(!StringUtils.check(buildingDTO.getStreet())) return false;
        if(!StringUtils.check(buildingDTO.getRentArea())) return false;
        if(!StringUtils.check(buildingDTO.getRentPriceDescription())) return false;


        if(!NumberUtils.checkNumber(buildingDTO.getNumberOfBasement())) return false;
        if(!NumberUtils.checkNumber(buildingDTO.getFloorArea())) return false;
        if(!NumberUtils.checkNumber(buildingDTO.getRentPrice())) return false;

        return true;
    }

    @Override
    public BuildingDTO findById(Long id)
    {
        BuildingEntity buildingEntity = buildingRepository.findById(id).get();
        BuildingDTO res = modelMapper.map(buildingEntity, BuildingDTO.class);

        List<RentAreaEntity> rentAreaEntities = buildingEntity.getRentAreaEntities();
        String rentArea = rentAreaEntities.stream().map(it->it.getValue().toString()).collect(Collectors.joining(","));

        res.setRentArea(rentArea);
        res.setTypeCode(toTypeCodeList(buildingEntity.getTypeCode()));

        return res;
    }

    public List<String> toTypeCodeList(String typeCodes)
    {
        String[] arr = typeCodes.split(",");
        return Arrays.asList(arr);
    }

    @Override
    public ResponseDTO listStaffs(Long buildingId)
    {
        BuildingEntity building = buildingRepository.findById(buildingId).get();
        List<UserEntity> staffs = userRepository.findByStatusAndRoles_Code(1, "STAFF");
        List<UserEntity> staffAssignment = building.getUserEntities();

        List<StaffResponseDTO> staffResponseDTOS = new ArrayList<>();
        ResponseDTO responseDTO = new ResponseDTO();

        for(UserEntity it : staffs)
        {
            StaffResponseDTO staffResponseDTO = new StaffResponseDTO();
            staffResponseDTO.setFullName(it.getFullName());
            staffResponseDTO.setStaffId(it.getId());

            if(staffAssignment.contains(it)) staffResponseDTO.setChecked("checked");
            else staffResponseDTO.setChecked("");

            staffResponseDTOS.add(staffResponseDTO);
        }
        responseDTO.setData(staffResponseDTOS);
        responseDTO.setMessage("success");
        return responseDTO;
    }

    @Override
    public int countTotalItem(List<BuildingSearchResponse> list)
    {
        int res = 0;
        for(BuildingSearchResponse it : list) res += buildingRepository.countTotalItem(it);
        return res;
    }

    @Override
    public AssignmentBuildingDTO addAssignmentBuildingEntity(AssignmentBuildingDTO assignmentBuildingDTO)
    {
        BuildingEntity buildingEntity = buildingRepository.findById(assignmentBuildingDTO.getBuildingId()).get();
        List<UserEntity> userEntities = userRepository.findByIdIn(assignmentBuildingDTO.getStaffs());
        buildingEntity.setUserEntities(userEntities);
        buildingRepository.save(buildingEntity);
        return assignmentBuildingDTO;
    }
}