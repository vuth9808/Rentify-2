package com.javaweb.repository.custom.impl;

import com.javaweb.builder.BuildingSearchBuilder;
import com.javaweb.entity.BuildingEntity;
import com.javaweb.model.response.BuildingSearchResponse;
import com.javaweb.repository.custom.BuildingRepositoryCustom;
import com.javaweb.utils.NumberUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.lang.reflect.Field;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class BuildingRepositoryImpl implements BuildingRepositoryCustom
{

    @PersistenceContext
    private EntityManager entityManager;


    public List<BuildingEntity> findAll (BuildingSearchBuilder buildingSearchBuilder, Pageable pageable)
    {
        StringBuilder sql = new StringBuilder
        (
                "select * from building b "
//            "Select b.name, b.street, b.ward,  b.numberofbasement, b.id, b.district, "
//                    + " b.managername, b.managerphone, b.floorarea, b.rentprice, b.servicefee, b.brokeragetee "
//                    + " from building b "
        );

        StringBuilder where = new StringBuilder(" where 1 = 1 ");

        joinExecute(buildingSearchBuilder, sql);
        queryNormal(buildingSearchBuilder, where);
        querySpecial(buildingSearchBuilder, where);


        groupByQuery(buildingSearchBuilder, where);
        sql.append(where);

        Query query = entityManager.createNativeQuery(sql.toString(), BuildingEntity.class);
        return query.getResultList();
    }

    @Override
    public int countTotalItem(BuildingSearchResponse buildingSearchResponse)
    {
        String sql = buildQueryFilter(buildingSearchResponse.getId());
        Query query = entityManager.createNativeQuery(sql);
        return query.getResultList().size();
    }

    private String buildQueryFilter(Long id) {
        String sql = "SELECT * FROM building b where b.id = " + id;
        return sql;
    }

    // join table
    public static void joinExecute(BuildingSearchBuilder buildingSearchBuilder, StringBuilder sql)
    {
        Long staffId = buildingSearchBuilder.getStaffId();
        if(NumberUtils.checkNumber(staffId)) sql.append(" join assignmentbuilding on assignmentbuilding.buildingid = b.id ");
    }


    // query
    public static void queryNormal(BuildingSearchBuilder buildingSearchBuilder, StringBuilder where)
    {
        try
        {
            Field[] fields = BuildingSearchBuilder.class.getDeclaredFields();

            for(Field item : fields)
            {
                item.setAccessible(true);
                String fieldName = item.getName();

                if(!fieldName.equals("staffId") && !fieldName.equals("typeCode") &&
                        !fieldName.startsWith("area") && !fieldName.startsWith("rentPrice"))
                {
                    Object value = item.get(buildingSearchBuilder);

                    if(value != null)
                    {
                        if(item.getType().getName().equals("java.lang.Long") || item.getType().getName().equals("java.lang.Integer"))
                        {
                            where.append(" and b." + fieldName + " = " + value + " ");
                        }

                        else if(item.getType().getName().equals("java.lang.String"))
                        {
                            where.append(" and b." + fieldName + " like '%" + value + "%' ");
                        }
                    }
                }
            }
        } catch(Exception ex) {
            ex.printStackTrace();
        }
    }

    public static void querySpecial(BuildingSearchBuilder buildingSearchBuilder, StringBuilder where)
    {
        Long staffId = buildingSearchBuilder.getStaffId();
        if(NumberUtils.checkNumber(staffId)) where.append(" and assignmentBuilding.staffId = " + staffId + " ");

        Long rentAreaTo = buildingSearchBuilder.getAreaTo();
        Long rentAreaFrom = buildingSearchBuilder.getAreaFrom();


        if(NumberUtils.checkNumber(rentAreaFrom) || NumberUtils.checkNumber(rentAreaTo))
        {
            where.append(" and exists (select * from rentArea r where b.id = r.buildingId ");
            if(rentAreaFrom != null) where.append(" and r.value >= " + rentAreaFrom + " ");
            if(rentAreaTo != null) where.append(" and r.value <= " + rentAreaTo + " ");
            where.append(") ");
        }

        Long rentPriceTo = buildingSearchBuilder.getRentPriceTo();
        Long rentPriceFrom = buildingSearchBuilder.getRentPriceFrom();

        if(NumberUtils.checkNumber(rentPriceFrom) || NumberUtils.checkNumber(rentPriceTo))
        {
            if(rentPriceFrom != null) where.append(" and b.rentPrice >= " + rentPriceFrom + " ");
            if(rentPriceTo != null) where.append(" and b.rentPrice <= " + rentPriceTo + " ");
        }

        List<String> typeCode = buildingSearchBuilder.getTypeCode();
        if(typeCode != null && typeCode.size() != 0)
        {
            where.append(" and ( ");
            String sql = typeCode.stream().map(it -> " b.type like " + "'%" + it + "%' ").collect(Collectors.joining(" or "));
            where.append(sql + " ) ");
        }
    }

    public static void groupByQuery(BuildingSearchBuilder buildingSearchBuilder, StringBuilder where)
    {
        where.append(" group by b.id ");
        if(buildingSearchBuilder.getStaffId() != null) where.append(" , assignmentbuilding.id; ");
    }
}
