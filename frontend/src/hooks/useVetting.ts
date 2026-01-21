import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vettingApi } from '../api';
import type { CreateVettingRequest, ClaimVettingRequest, CompleteVettingRequest } from '../types';

export const useVettingRequests = (params?: { page?: number; pageSize?: number; status?: string }) => {
  return useQuery({
    queryKey: ['vettingRequests', params],
    queryFn: () => vettingApi.getVettingRequests(params),
  });
};

export const useVettingRequest = (id: string) => {
  return useQuery({
    queryKey: ['vettingRequest', id],
    queryFn: () => vettingApi.getVettingRequest(id),
    enabled: !!id,
  });
};

export const useCreateVettingRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateVettingRequest) => vettingApi.createVettingRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vettingRequests'] });
    },
  });
};

export const useClaimVettingRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ClaimVettingRequest) => vettingApi.claimVettingRequest(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vettingRequest', variables.vettingRequestId] });
      queryClient.invalidateQueries({ queryKey: ['vettingRequests'] });
    },
  });
};

export const useCompleteVettingRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CompleteVettingRequest) => vettingApi.completeVettingRequest(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vettingRequest', variables.vettingRequestId] });
      queryClient.invalidateQueries({ queryKey: ['vettingRequests'] });
    },
  });
};

export const useCancelVettingRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => vettingApi.cancelVettingRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vettingRequests'] });
    },
  });
};
