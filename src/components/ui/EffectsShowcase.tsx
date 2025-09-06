import React from 'react';
import { cn } from '../../lib/utils';
import {
  BlurBackdrop,
  NoiseOverlay,
  TextureCard,
  DepthLayer,
  ParallaxContainer,
  PremiumSection
} from './BlurEffects';

interface EffectsShowcaseProps {
  className?: string;
}

export const EffectsShowcase: React.FC<EffectsShowcaseProps> = ({ className }) => {
  return (
    <div className={cn('space-y-8 p-8', className)}>
      {/* Hero Section com Parallax */}
      <PremiumSection variant="hero" className="p-12 text-center">
        <ParallaxContainer speed="slow">
          <h1 className="text-4xl font-bold text-white mb-4">
            Efeitos Visuais Premium
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Demonstração dos efeitos de blur, texturas e profundidade implementados
          </p>
        </ParallaxContainer>
      </PremiumSection>

      {/* Grid de Cards com diferentes efeitos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card com Blur Backdrop */}
        <DepthLayer depth={2}>
          <BlurBackdrop variant="medium" className="p-6 rounded-xl bg-white/10 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Blur Backdrop</h3>
            <p className="text-white/70 text-sm">
              Efeito de blur de fundo com diferentes intensidades
            </p>
          </BlurBackdrop>
        </DepthLayer>

        {/* Card com Texture */}
        <TextureCard texture="grain" className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20">
          <DepthLayer depth={3}>
            <h3 className="text-lg font-semibold text-white mb-2">Texture Grain</h3>
            <p className="text-white/70 text-sm">
              Textura de granulação sutil para adicionar profundidade
            </p>
          </DepthLayer>
        </TextureCard>

        {/* Card com Noise Overlay */}
        <div className="relative p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/20">
          <NoiseOverlay intensity="medium" />
          <DepthLayer depth={4}>
            <h3 className="text-lg font-semibold text-white mb-2">Noise Overlay</h3>
            <p className="text-white/70 text-sm">
              Overlay de ruído para efeitos de textura avançados
            </p>
          </DepthLayer>
        </div>
      </div>

      {/* Seção Modal */}
      <PremiumSection variant="modal" className="p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Modal Premium</h2>
        <p className="text-white/80 mb-6">
          Modal com efeitos glassmorphism e blur pesado para sobreposições elegantes
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 className="font-medium text-white mb-2">Característica 1</h4>
            <p className="text-white/70 text-sm">Blur backdrop com intensidade heavy</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 className="font-medium text-white mb-2">Característica 2</h4>
            <p className="text-white/70 text-sm">Textura paper para efeito premium</p>
          </div>
        </div>
      </PremiumSection>

      {/* Cards com diferentes profundidades */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">Níveis de Profundidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((depth) => (
            <DepthLayer key={depth} depth={depth as 1 | 2 | 3 | 4 | 5}>
              <div className="p-4 rounded-lg bg-white/10 border border-white/20 text-center">
                <h4 className="font-medium text-white mb-1">Depth {depth}</h4>
                <p className="text-white/70 text-xs">Nível {depth}</p>
              </div>
            </DepthLayer>
          ))}
        </div>
      </div>

      {/* Seção Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[400px]">
        <PremiumSection variant="sidebar" className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Sidebar Premium</h3>
          <nav className="space-y-2">
            {['Dashboard', 'Analytics', 'Settings', 'Profile'].map((item) => (
              <a
                key={item}
                href="#"
                className="block p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </PremiumSection>

        <div className="lg:col-span-3 space-y-4">
          <PremiumSection variant="card" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Conteúdo Principal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextureCard texture="fabric" className="p-4 rounded-lg bg-white/5">
                <h4 className="font-medium text-white mb-2">Texture Fabric</h4>
                <p className="text-white/70 text-sm">Padrão de tecido sutil</p>
              </TextureCard>
              <TextureCard texture="paper" className="p-4 rounded-lg bg-white/5">
                <h4 className="font-medium text-white mb-2">Texture Paper</h4>
                <p className="text-white/70 text-sm">Efeito de papel texturizado</p>
              </TextureCard>
            </div>
          </PremiumSection>
        </div>
      </div>

      {/* Demonstração de Parallax */}
      <div className="relative min-h-[300px] overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
        <ParallaxContainer speed="fast" className="absolute inset-0">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Parallax Effect</h3>
              <p className="text-white/80">Role a página para ver o efeito parallax</p>
            </div>
          </div>
        </ParallaxContainer>
        <ParallaxContainer speed="medium" className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-neon-500/20 blur-xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-purple-500/20 blur-2xl" />
        </ParallaxContainer>
      </div>

      {/* Combinação de todos os efeitos */}
      <PremiumSection variant="hero" className="p-12">
        <ParallaxContainer speed="slow">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Combinação Premium</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Todos os efeitos combinados para criar uma experiência visual premium
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Glassmorphism', desc: 'Efeitos de vidro modernos' },
              { title: 'Depth Layers', desc: 'Múltiplas camadas de profundidade' },
              { title: 'Texturas', desc: 'Padrões sutis de textura' }
            ].map((item, index) => (
              <DepthLayer key={index} depth={(index + 2) as 2 | 3 | 4}>
                <TextureCard texture={['noise', 'grain', 'paper'][index] as 'noise' | 'grain' | 'paper'}>
                  <BlurBackdrop variant="glass">
                    <div className="p-6 rounded-xl bg-white/5 border border-white/20">
                      <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-white/70 text-sm">{item.desc}</p>
                    </div>
                  </BlurBackdrop>
                </TextureCard>
              </DepthLayer>
            ))}
          </div>
        </ParallaxContainer>
      </PremiumSection>
    </div>
  );
};

export default EffectsShowcase;