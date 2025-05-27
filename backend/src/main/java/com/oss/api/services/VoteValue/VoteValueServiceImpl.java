package com.oss.api.services.VoteValue;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.oss.api.dto.VoteValueDto;
import com.oss.api.models.Vote;
import com.oss.api.models.VoteValue;
import com.oss.api.repository.factory.FactoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor(onConstructor_ = @Lazy)
public class VoteValueServiceImpl implements VoteValueService {
    private final FactoryRepository fr;
    private final ModelMapper modelMapper;

    @Override
    public List<VoteValue> findByVote(Vote vote) {
        return fr.getVoteValueRepository().findByVote(vote);
    }

    @Override
    public void save(VoteValue voteValue) {
        fr.getVoteValueRepository().save(voteValue);
    }

    @Override
    public void deleteByVote(Vote vote) {
        List<VoteValue> voteValues = fr.getVoteValueRepository().findByVote(vote);
        if (!voteValues.isEmpty()) {
            fr.getVoteValueRepository().deleteAll(voteValues);
        }
    }

    @Override
    public VoteValueDto convertToDto(VoteValue voteValue) {
        return modelMapper.map(voteValue, VoteValueDto.class);
    }

    @Override
    public VoteValue convertToEntity(VoteValueDto dto) {
        return modelMapper.map(dto, VoteValue.class);
    }
}