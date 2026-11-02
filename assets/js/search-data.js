// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "Peer-reviewed papers, in reverse chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "Research, school projects from CentraleSupélec and the Master MVA and personal projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "Download the PDF version with the icon on the right.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "news-our-paper-dropong-was-published-at-the-european-control-conference-ecc-2024-in-stockholm",
          title: 'Our paper DroPong was published at the European Control Conference (ECC 2024) in...',
          description: "",
          section: "News",},{id: "news-started-a-data-science-internship-at-datamaran-in-valencia-spain",
          title: 'Started a data science internship at Datamaran in Valencia, Spain.',
          description: "",
          section: "News",},{id: "news-our-paper-delivery-race-game-was-published-at-the-ifac-workshop-on-aerospace-control-education-wace-2024",
          title: 'Our paper Delivery Race Game was published at the IFAC Workshop on Aerospace...',
          description: "",
          section: "News",},{id: "news-started-a-machine-learning-research-internship-at-the-university-of-auckland-on-bird-species-detection-from-audio",
          title: 'Started a machine learning research internship at the University of Auckland on bird...',
          description: "",
          section: "News",},{id: "news-started-the-master-mva-at-ens-paris-saclay",
          title: 'Started the Master MVA at ENS Paris-Saclay.',
          description: "",
          section: "News",},{id: "news-the-waraki-pipeline-fed-into-simon-ingram-s-work-vibrating-world-rotokare-forest-shown-at-the-govett-brewster-art-gallery-and-len-lye-centre-in-new-plymouth",
          title: 'The Waraki pipeline fed into Simon Ingram’s work Vibrating World: Rotokare Forest, shown...',
          description: "",
          section: "News",},{id: "news-started-a-research-internship-at-callyope-on-reasoning-in-audio-language-models",
          title: 'Started a research internship at Callyope on reasoning in audio language models.',
          description: "",
          section: "News",},{id: "projects-traffic-with-cellular-automata",
          title: 'Traffic with cellular automata',
          description: "Modeling road traffic with cellular automata to study how to reduce pollution.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/10_traffic_ca/";
            },},{id: "projects-super-mario-multiverse",
          title: 'Super Mario Multiverse',
          description: "Meta-RL agents that adapt to random gravity and jump physics in Super Mario Bros.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/12_super_mario/";
            },},{id: "projects-histopathology-across-hospitals",
          title: 'Histopathology across hospitals',
          description: "Tumor detection on images from an unseen hospital, with a frozen foundation model. Ranked 4th of 45 teams.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/13_histopathology/";
            },},{id: "projects-counterfactual-audio-text-learning",
          title: 'Counterfactual audio-text learning',
          description: "Reproducing a paper that adds LLM-generated counterfactual captions to CLAP training.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/14_counterfactual_clap/";
            },},{id: "projects-geometric-context-from-one-image",
          title: 'Geometric context from one image',
          description: "Ground, vertical and sky from a single photo, with belief propagation and GNNs, then used to correct depth.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/15_geometric_context/";
            },},{id: "projects-reverse-engineering-a-dehazing-filter",
          title: 'Reverse-engineering a dehazing filter',
          description: "Rebuilding DxO&#39;s ClearView Plus with the dark channel prior.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/16_clearview/";
            },},{id: "projects-contrastive-learning-for-chinese-characters",
          title: 'Contrastive learning for Chinese characters',
          description: "MoCo self-supervised learning on 2.9 million images of Chinese characters.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/17_moco/";
            },},{id: "projects-retinal-vessel-segmentation",
          title: 'Retinal vessel segmentation',
          description: "Segmenting blood vessels in eye fundus images with classical image processing.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/18_retina/";
            },},{id: "projects-threat-detection-in-x-ray-scans",
          title: 'Threat detection in X-ray scans',
          description: "Finding prohibited items in baggage scans with classical computer vision only. Ranked 4th of 34.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/19_xray/";
            },},{id: "projects-pédantix-bot",
          title: 'Pédantix bot',
          description: "Teaching an agent to find the hidden Wikipedia article in a word-guessing game. RL, language models and clustering.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_pedantix/";
            },},{id: "projects-graph-kernel-neural-networks",
          title: 'Graph Kernel Neural Networks',
          description: "Studying a GNN that uses graph kernels to go beyond message passing.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/20_gknn/";
            },},{id: "projects-community-detection-in-graphs",
          title: 'Community detection in graphs',
          description: "From spectral clustering to stochastic block models and graph autoencoders.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/21_graph_clustering/";
            },},{id: "projects-a-chess-llm-under-1m-parameters",
          title: 'A chess LLM under 1M parameters',
          description: "A tiny GPT that plays chess, with a square-level tokenizer to save parameters for the model.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/22_chess/";
            },},{id: "projects-an-llm-agent-for-zork",
          title: 'An LLM agent for Zork',
          description: "A ReAct agent that plays text adventures through MCP tools, with memory and anti-loop rules.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/23_zork/";
            },},{id: "projects-flashattention-in-triton",
          title: 'FlashAttention in Triton',
          description: "Writing the FlashAttention forward pass as a GPU kernel, from online softmax to Triton.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/24_flashattention/";
            },},{id: "projects-cinemadex",
          title: 'Cinemadex',
          description: "A collectible card game where movies are the cards. Open a free pack every hour.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/25_cinemadex/";
            },},{id: "projects-pokelookalike",
          title: 'PokeLookalike',
          description: "Which first-generation Pokémon do you look like? Face matching that runs entirely in the browser.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/26_pokelookalike/";
            },},{id: "projects-sleep-staging-from-eeg",
          title: 'Sleep staging from EEG',
          description: "Sleep stages from a five-channel EEG headband, with gradient boosting and an HMM. Ranked 1st of 122 teams.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/27_sleep_staging/";
            },},{id: "projects-railway-visual-odometry",
          title: 'Railway visual odometry',
          description: "Metric localization of a train from a single camera, using the geometry of the track.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_railway_odometry/";
            },},{id: "projects-waraki",
          title: 'Waraki',
          description: "Live bird species detection from a Taranaki forest, for an art installation at the Len Lye Centre.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_bioacoustics/";
            },},{id: "projects-educational-robot-games",
          title: 'Educational robot games',
          description: "Games with ground robots and drones that teach control and computer vision. Two published papers.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_robot_games/";
            },},{id: "projects-freight-yard-optimization-with-sncf",
          title: 'Freight yard optimization with SNCF',
          description: "Scheduling machines, tracks and staff in a freight marshalling yard with mixed-integer programming.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_train_scheduling/";
            },},{id: "projects-digital-twin-of-a-robot-arm",
          title: 'Digital twin of a robot arm',
          description: "A digital failure twin for reliability modeling and predictive maintenance of a robot.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_digital_twin/";
            },},{id: "projects-text-flappy-bird-with-rl",
          title: 'Text Flappy Bird with RL',
          description: "Monte Carlo and SARSA(λ) agents for a text version of Flappy Bird.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_flappy_rl/";
            },},{id: "projects-freediving-game",
          title: 'Freediving game',
          description: "A pygame freediving game where your real breath hold is the timer.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_freediving_game/";
            },},{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/comoxx", "_blank");
        },
      },{
        id: 'social-kaggle',
        title: 'Kaggle',
        section: 'Socials',
        handler: () => {
          window.open("https://www.kaggle.com/comoxx", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/comehosxe", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
